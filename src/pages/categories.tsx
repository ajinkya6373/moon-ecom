import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { getUserFromToken } from '~/utils/auth';

const CategoriesPage = () => {
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const pageSize = 6;
  const router = useRouter();

  // Fetch categories data
  const { data: categories, isLoading, isError, error } = api.category.getAll.useQuery();
  const selectMutation = api.category.select.useMutation();
  const { data: userData, refetch } = api.user.getUserDetails.useQuery(
    { userId: userId ?? 0 },
    { enabled: !!userId }
  );

  useEffect(() => {
    // Fetch token from cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
    if (token) {
      const decoded:any = getUserFromToken(token);
      if (decoded) {
        setUserId(decoded.id);
      } 
      else {
        router.push('/login');
      }
    } 
    else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (userData) {
      const selectedCategories = userData.categories.map((category:any) => category.id);
      setSelectedCategories(selectedCategories);
    }
  }, [userData]);
  // Handle pagination
  const paginatedCategories = categories
    ? categories.slice((page - 1) * pageSize, page * pageSize)
    : [];

  const handleNextPage = () => {
    if (categories && page * pageSize < categories.length) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  // Handle category selection
  const handleCheckboxChange = async (categoryId: number) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedCategories);

    // Update selected categories in the backend
    if (userId) {
      try {
        await selectMutation.mutateAsync({
          userId,
          categoryIds: updatedCategories,
        });
      } catch (error) {
        console.error('Error saving categories:', error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  // Error state
  if (isError) {
    return <div>Error loading categories: {error.message}</div>;
  }

  // No categories state
  if (!categories || categories.length === 0) {
    return <div>No categories available.</div>;
  }

  return (
    <div>
      <h1>Please mark your interests!</h1>
      <p>We will keep you notified.</p>
      <div>
        <h2>My saved interests!</h2>
        <ul>
          {paginatedCategories.map((category) => (
            <li key={category.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCheckboxChange(category.id)}
                />
                {category.name}
              </label>
            </li>
          ))}
        </ul>
        <div>
          <button onClick={handlePrevPage} disabled={page === 1}>
            &lt;&lt;
          </button>
          {Array.from({ length: Math.ceil(categories.length / pageSize) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              disabled={p === page}
              style={{ fontWeight: p === page ? 'bold' : 'normal' }}
            >
              {p}
            </button>
          ))}
          <button onClick={handleNextPage} disabled={page * pageSize >= categories.length}>
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
