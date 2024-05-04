'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const FnbPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center ">
      <Image
        className="rounded-md border border-black dark:border-white"
        src="/posFNB.png"
        alt="FNB"
        width={550}
        height={697}
      />
      <button
        onClick={() => router.back()}
        className="mt-2 rounded border-2 border-black px-2 py-1 font-bold hover:bg-slate-200  dark:border-white dark:hover:bg-slate-600"
      >
        Return
      </button>
    </div>
  );
};

export default FnbPage;
