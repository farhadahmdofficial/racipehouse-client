


'use server';

import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function getAllUsers() {
  try {
    await client.connect();
    const db = client.db('recipehouse');
    const users = await db.collection('user').find({}).toArray();
    
    // MongoDB ObjectId কে String-এ কনভার্ট করতে হবে
    return users.map((user) => ({
      ...user,
      _id: user._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function toggleUserBlockStatus(userId, currentStatus) {
  try {
    await client.connect();
    const db = client.db('recipehouse');
    await db.collection('user').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isBlocked: !currentStatus } }
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false };
  }
}




