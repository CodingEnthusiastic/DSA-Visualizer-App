// components/KBCCard.tsx
import Link from "next/link";

export default function KBCCard() {
  return (
    <div className="mt-16 mx-auto max-w-3xl p-8 rounded-lg shadow-lg bg-gradient-to-r from-blue-800 to-purple-900 text-center">
      <h2 className="text-3xl font-bold text-yellow-400">Kaun Banega MAANGpati?</h2>
      <p className="text-lg text-slate-200 mt-2">Test your coding knowledge and win exciting prizes!</p>
      <Link href="https://codingenthusiastic.github.io/kon-banega-crorepati-frontend/" target="_blank">
        <button className="mt-6 px-6 py-3 bg-yellow-500 text-black font-bold text-lg rounded-lg hover:bg-yellow-600 transition">
          Play Now
        </button>
      </Link>
    </div>
  );
}
