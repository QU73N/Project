import { Client, Account, Avatars } from 'react-native-appwrite'

export const client = new Client()
        .setProject('699db49a0033bd7ef299')
        .setPlatform('dev.sti.optisched');

export const account = new Account(client)
export const avatars = new Avatars(client)