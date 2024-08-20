import Link from 'next/link';
import { LuAngry } from "react-icons/lu"; // Import the LuAngry icon

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <LuAngry size={50} className="text-red-600" /> {/* Display the LuAngry icon */}
            <h1 className="text-6xl font-bold text-gray-800 mt-4">404</h1>
            <p className="text-xl text-gray-600 mt-2">... Page does not exist.</p>
            <Link href="/" className="mt-6 px-4 py-2 bg-brandcolor text-white rounded-md hover:bg-blue-700 transition">
                Go Home
            </Link>
        </div>
    );
}
