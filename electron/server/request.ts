import { Client } from '@renmu/bili-api'
import axios from 'axios'

const client = new Client()

const request = axios.create({
  withCredentials: true,
  timeout: 50000,
})

export {
  client,
  request,
}
