import Joi from 'joi';
import { getCurrentDate, getCurrentHour } from './helper';
import CONFIG from './constant';

export const bookingBodySchema = Joi.object({
  customer_name: Joi.string().required().messages({
    'string.base': 'Customer name must be a string',
    'any.required': 'Customer name is required',
  }),
  customer_email: Joi.string().email().required().messages({
    'string.email': 'Customer email must be a valid email',
    'any.required': 'Customer email is required',
  }),
  //YYYY/MM/DD
  booking_date: Joi.date().min(getCurrentDate()).required().messages({
    'date.base': 'Booking date must be a date',
    'date.min': 'Booking date must be greater than or equal current date',
    'any.required': 'Booking date is required',
  }),
  //HH:00:00
  booking_time: Joi.number()
    .min(CONFIG.opening_time)
    .max(CONFIG.closing_time - 1)
    .integer()
    .required()
    .messages({
      'number.base': 'Booking time must be a number',
      'number.min': 'Bowling center is open from 9:00 to 22:00',
      'number.max': 'Bowling center is open from 9:00 to 22:00',
      'any.required': 'Booking time is required',
      'number.integer': 'Booking time must be an integer',
    }),
  playing_time: Joi.number().min(1).max(3).required().messages({
    'number.base': 'Playing time must be a number',
    'number.min': 'Have to play at least 1 hour',
    'number.max': 'Can play up to 3 hours',
    'any.required': 'Playing time is required',
  }),
  amount_of_player: Joi.number().min(1).required().integer().messages({
    'number.base': 'Amount of player must be a number',
    'number.integer': 'Amount of player must be an integer',
    'number.min': 'Have to book at least 1 player',
    'any.required': 'Amount of player is required',
  }),
  shoe_ids: Joi.array()
    .items(Joi.string())
    .length(Joi.ref('amount_of_player'))
    .required()
    .messages({
      'array.base': 'Shoe ids must be an array',
      'array.length': 'Amount of shoe must be equal to amount of player',
      'any.required': 'Shoe ids is required',
    }),
  line_ids: Joi.array().min(1).max(CONFIG.number_of_lines).required().messages({
    'array.min': 'Have to book at least 1 lane',
    'any.required': 'Lane is required',
  }),
});
