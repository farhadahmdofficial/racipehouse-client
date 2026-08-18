


// src/app/[...not-found]/page.jsx
import { notFound } from 'next/navigation';

export default function CatchAllNotFound() {
  notFound(); // এটি গ্লোবাল not-found.jsx রেন্ডার করবে
}
