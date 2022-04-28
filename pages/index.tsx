import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
  MdChevronLeft as LeftIcon,
  MdChevronRight as RightIcon,
} from 'react-icons/md'
import Avatar from '../assets/avatar/CM.png'
import axios, { AxiosPromise } from 'axios'
import handler, { GetUsersResponse } from './api/users'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface User {
  _id: string
  email: string
  name: string
  avatar: string
  createdAt: string
  updatedAt: string
}

const fetchUsers = async (page: number = 1, pageSize: number = 5) => {
  return axios
    .get('http://localhost:3000/api/users', {
      params: {
        page,
        pageSize,
      },
    })
    .then((res) => res.data)
}

export const getServerSideProps = async () => {
  const data = await fetchUsers()

  return {
    props: {
      data,
    },
  }
}

const Home: NextPage<GetUsersResponse> = ({ initialData }: any) => {
  const [page, setPage] = useState(4)
  const [pageSize, setPageSize] = useState(5)
  const [idOfUserToBeEdited, setIdOfUserToBeEdited] = useState('')
  const [email, setEmail] = useState('')

  const queryClient = useQueryClient()
  const { isLoading, isError, data, error, isFetching, isPreviousData } =
    useQuery(['users', { page }], () => fetchUsers(page, pageSize), {
      initialData,
      keepPreviousData: true,
    })
  const mutation = useMutation(
    (updatedData: { id: string; email: string }) => {
      return axios.put('/api/users', updatedData)
    },
    {
      onError: (error, variables, context) => {
        toast.error('An error occurred while saving the changes')
      },

      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries('users')
        toast.success('Saved successfully!')
      },
    }
  )

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error instanceof Error && error.message}</span>
  }

  let pageNumbers = []

  for (let i = 1; i <= data.pages; i++) {
    const pageNumber = (
      <button
        key={i}
        className={`${styles.paginationControl} ${
          page === i ? styles.active : null
        }`}
        onClick={() => setPage(i)}
      >
        {i}
      </button>
    )
    pageNumbers.push(pageNumber)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pagination Demo</title>
        <meta
          name='description'
          content='Simple app to demonstrate pagination'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.infoContainer}>
        <h1 className={styles.title}>Users{isFetching && '...'}</h1>
        <p className={styles.description}>These are the user data.</p>
      </div>
      <table className={styles.paginatedTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.users?.map((user: User) => (
            <tr key={user._id}>
              <td>
                <a href='#'>
                  <Image src={Avatar} alt='' width={25} height={25} />
                  {user.name}
                </a>
              </td>
              {user._id === idOfUserToBeEdited ? (
                <td>
                  <input
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    onBlur={() => {
                      mutation.mutate({ id: idOfUserToBeEdited, email })
                      setIdOfUserToBeEdited('')
                    }}
                  />
                </td>
              ) : (
                <td
                  onClick={() => {
                    setEmail(user.email)
                    setIdOfUserToBeEdited(user._id)
                  }}
                >
                  {user.email}
                </td>
              )}
              <td>{user.createdAt}</td>
              <td>{user.updatedAt}</td>
              <td>
                <a href='#'>View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.paginationContainer}>
        <p className={styles.paginationInfo}>{`${
          (page - 1) * pageSize + 1
        } to ${page < data.pages ? page * data.pageSize : data.count}
         of ${data.count}`}</p>
        <div className={styles.paginationNumberContainer}>
          <button
            className={styles.paginationControl}
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <LeftIcon />
          </button>
          {pageNumbers.map((pageNumber) => pageNumber)}
          <button
            className={styles.paginationControl}
            disabled={!(page < data.pages)}
            onClick={() => {
              if (page < data.pages) {
                setPage((prev) => prev + 1)
              }
            }}
          >
            <RightIcon />
          </button>
        </div>
        <select
          name='pageSize'
          id=''
          className={styles.paginationControl}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            queryClient.invalidateQueries('users')
          }}
        >
          <option value='5'>5</option>
          <option value='10'>10</option>
          <option value='25'>25</option>
          <option value='50'>50</option>
          <option value='100'>100</option>
        </select>
        <label htmlFor='pageNumber' className={styles.paginationControlLabel}>
          Goto
        </label>
        <input
          type='number'
          name='pageNumber'
          className={styles.paginationControl}
          onChange={(e) => setPage(Number(e.target.value))}
          max={data.pages}
        />
      </div>
    </div>
  )
}

export default Home
