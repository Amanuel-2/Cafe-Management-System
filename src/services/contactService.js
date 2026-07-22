import { database } from './database.js';

export const contactService = {
  create(values) {
    if (values.name.trim().length < 2) throw new Error('Enter your name.');
    if (!values.email.trim().includes('@')) throw new Error('Enter a valid email address.');
    if (values.message.trim().length < 10) throw new Error('Your message must contain at least 10 characters.');
    return database.create('contactMessages', { name: values.name.trim(), email: values.email.trim().toLowerCase(), phone: values.phone.trim(), message: values.message.trim(), status: 'new' }, 'contact');
  },
};
