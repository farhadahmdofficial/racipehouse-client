

'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation'; // <-- এটি ইমপোর্ট করুন
import { FaTrash, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { deleteRecipe } from '@/lib/actions/recipeActions';

export default function DeleteButton({ recipeId }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // <-- হুক ইনস্ট্যান্স তৈরি করুন

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        const res = await deleteRecipe(recipeId);
        if (res?.success) {
          toast.success(res.message || 'Recipe deleted successfully!');
          router.refresh(); // <-- পেজের UI সাথে সাথে আপডেট করবে
        } else {
          toast.error(res?.message || 'Failed to delete recipe.');
        }
      } catch (error) {
        toast.error('Something went wrong!');
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      type="button"
      className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-50 dark:bg-red-950/40 hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white border border-red-200 dark:border-red-800/60 px-3.5 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
    >
      {isPending ? (
        <FaSpinner className="animate-spin text-[10px]" />
      ) : (
        <FaTrash className="text-[10px]" />
      )}
      <span>{isPending ? 'Deleting...' : 'Delete'}</span>
    </button>
  );
}






// ok code 

// 'use client';

// import { useTransition } from 'react';
// import { FaTrash, FaSpinner } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import { deleteRecipe } from '@/lib/actions/recipeActions';

// export default function DeleteButton({ recipeId }) {
//   const [isPending, startTransition] = useTransition();

//   const handleDelete = () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
//     if (!confirmDelete) return;

//     startTransition(async () => {
//       try {
//         const res = await deleteRecipe(recipeId);
//         if (res?.success) {
//           toast.success(res.message || 'Recipe deleted successfully!');
//         } else {
//           toast.error(res?.message || 'Failed to delete recipe.');
//         }
//       } catch (error) {
//         toast.error('Something went wrong!');
//       }
//     });
//   };

//   return (
//     <button
//       onClick={handleDelete}
//       disabled={isPending}
//       type="button"
//       className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-50 dark:bg-red-950/40 hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white border border-red-200 dark:border-red-800/60 px-3.5 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
//     >
//       {isPending ? (
//         <FaSpinner className="animate-spin text-[10px]" />
//       ) : (
//         <FaTrash className="text-[10px]" />
//       )}
//       <span>{isPending ? 'Deleting...' : 'Delete'}</span>
//     </button>
//   );
// }



