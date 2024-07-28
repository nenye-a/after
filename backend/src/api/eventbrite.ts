/**
 * @file Note: The eventbrite API is likely not in a place to be used, there is no ability to
 * search at the moment. We will do more work here after we have a reliable way of getting
 * the events that are required.
 */

import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

// TODO: Convert to using OAuth once releasing the product.
const EVENTBRITE_PRIVATE_TOKEN = process.env.EVENTBRITE_PRIVATE_TOKEN;

const eventbrite = axios.create({
  baseURL: 'https://www.eventbriteapi.com/v3',
  headers: {
    Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export default eventbrite;
