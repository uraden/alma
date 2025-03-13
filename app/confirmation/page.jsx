"use client"
import Link from "next/link";
import { useSearchParams } from 'next/navigation';


export default function Confirmation() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex justify-center">
      <div className="bg-white p-6 rounded max-w-md text-center">
        <h1 className="text-[48px] font-bold mb-4">Thank You</h1>
        <p className="mb-4 text-[18px]">
          Your information was submitted to our team of immigration attorneys.
          Someone will be in touch soon at <strong>{email}</strong>. Thank you!
        </p>
        <Link href="/">
          <button className="bg-black text-white px-4 py-2 rounded submit-button">
            Go back to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}