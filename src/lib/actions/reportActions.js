



"use server";

import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export async function getAllReports() {
  try {
    const res = await axios.get(`${API_BASE}/api/admin/reports`);
    if (res.data.success) {
      return res.data.reports || [];
    }
    return [];
  } catch (err) {
    console.error('Failed to load reports:', err);
    return [];
  }
}





