import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { getUserFromToken } from "~/utils/auth";
import Navbar from "./components/Navbar";

const CategoriesPage = () => {
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const pageSize = 6;
  const router = useRouter();

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = api.category.getAll.useQuery();
  const selectMutation = api.category.select.useMutation();
  const { data: userData, refetch } = api.user.getUserDetails.useQuery(
    { userId: userId ?? 0 },
    { enabled: !!userId },
  );

  useEffect(() => {
    // Fetch token from cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
    if (token) {
      const decoded: any = getUserFromToken(token);
      if (decoded) {
        setUserId(decoded.id);
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (userData) {
      const selectedCategories = userData.categories.map(
        (category: any) => category.id,
      );
      setSelectedCategories(selectedCategories);
    }
  }, [userData]);

  const paginatedCategories = categories
    ? categories.slice((page - 1) * pageSize, page * pageSize)
    : [];

  const handleNextPage = () => {
    if (categories && page * pageSize < categories.length) {
      setPage((prev) => prev + 1);
    }
  };

  // const handlePrevPage = () => {
  //   setPage((prev) => Math.max(1, prev - 1));
  // };

  // Handle category selection
  const handleCheckboxChange = async (categoryId: number) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedCategories);

    if (userId) {
      try {
        await selectMutation.mutateAsync({
          userId,
          categoryIds: updatedCategories,
        });
      } catch (error) {
        console.error("Error saving categories:", error);
      }
    }
  };

  // // Loading state
  // if (isLoading) {
  //   return <div>Loading categories...</div>;
  // }

  // // Error state
  // if (isError) {
  //   return <div>Error loading categories: {error.message}</div>;
  // }

  // // No categories state
  if (!categories || categories.length === 0) {
    return <div className="w-full h-[100vh] flex items-center justify-center">No categories available.</div>;
  }

  const getPaginationRange = () => {
    const totalPages = Math.ceil(categories.length / pageSize);
    let startPage, endPage;

    if (totalPages <= 7) {
      // less than 7 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 7 total pages so calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(7 / 2);
      const maxPagesAfterCurrentPage = 7 - maxPagesBeforeCurrentPage - 1;

      if (page <= maxPagesBeforeCurrentPage) {
        // near the start
        startPage = 1;
        endPage = 7;
      } else if (page + maxPagesAfterCurrentPage >= totalPages) {
        // near the end
        startPage = totalPages - 6;
        endPage = totalPages;
      } else {
        // middle
        startPage = page - maxPagesBeforeCurrentPage;
        endPage = page + maxPagesAfterCurrentPage;
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  return (
    <>
      <Navbar userName={userData?.name}/>
      <div className="mx-auto mt-8 flex max-w-[576px] flex-col justify-between rounded-[20px] border border-gray-300 p-12">
      {isLoading ? (
          <div>Loading categories...</div>
        ) : isError ? (
          <div>Error loading categories: {error?.message}</div>
        ) : !categories || categories.length === 0 ? (
          <div>No categories available.</div>
        ) : (
          <>          
        <h2 className="mb-6 text-center text-[2rem] font-semibold">
          Please mark your interests!
        </h2>
        <p className="text-center text-base font-normal">
          We will keep you notified.
        </p>
        <div>
          <h2 className="my-4 text-xl font-medium">My saved interests!</h2>
          <ul className="space-y-4">
            {paginatedCategories.map((category) => (
              <li key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-6 w-6 cursor-pointer rounded-md border-2 border-black accent-black focus:outline-none"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCheckboxChange(category.id)}
                />
                <label className="ml-2 text-base font-normal text-black">
                  {category.name}
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-xl text-[#ACACAC]">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="mx-1"
            >
              &lt;&lt;
            </button>
            {getPaginationRange().map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                disabled={p === page}
                className={`${p === page ? "font-bold text-black" : "font-normal"} mx-1`}
              >
                {p}
              </button>
            ))}
            {page !== 1 &&
              page < Math.ceil(categories.length / pageSize) - 3 && (
                <>
                  ...
                  <button
                    onClick={() =>
                      setPage(Math.ceil(categories.length / pageSize))
                    }
                    className="mx-1"
                  >
                    {Math.ceil(categories.length / pageSize)}
                  </button>
                </>
              )}
            <button
              onClick={handleNextPage}
              disabled={page * pageSize >= categories.length}
              className="mx-1"
            >
              &gt;&gt;
            </button>
          </div>
        </div>
          </>
        )
      }
      </div>
    </>
  );
};

export default CategoriesPage;
