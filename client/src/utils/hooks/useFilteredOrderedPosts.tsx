import { Post } from "@/types/postTypes";
import {
  getLocalTimeZone,
  parseDateTime,
  today,
} from "@internationalized/date";
import { useMemo, useState } from "react";

export const useFilteredAndSortedPosts = (
  items: any[],
  defaultSolapa?: "active" | "nextToExpire" | "inactive" | "expired"
) => {
  // Modify searchTerm to hold two terms for a search
  // search phases
  const [searchTerms, setSearchTerms] = useState<(string | undefined)[]>([]);
  // Sorting key and direction
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "",
    direction: "",
  });
  const [solapaSelected, setSolapaSelected] = useState<
    "active" | "nextToExpire" | "inactive" | "expired" | undefined
  >(defaultSolapa);

  const hasSearchFilter = Boolean(searchTerms[0] || searchTerms[1]);
  // filter options
  const [filter, setFilter] = useState<{
    category: string[];
    priceRange: (number | undefined)[];
  }>({
    category: [],
    priceRange: [undefined, undefined],
  });

  // Filtered items
  const filteredItems = useMemo(() => {
    let filteredPosts = [...items];

    const todayDate = today(getLocalTimeZone());
    switch (solapaSelected) {
      case "nextToExpire":
        // filter posts that aare going to expire in the next 7 days
        filteredPosts = filteredPosts.filter((post: Post) => {
          const diff = parseDateTime(post.endDate.replace("Z", "")).compare(
            todayDate
          );
          return diff >= 0 && diff <= 7;
        });
        break;
      case "inactive":
        filteredPosts = filteredPosts.filter((post: Post) => !post.isActive);
        break;
      case "expired":
        filteredPosts = filteredPosts.filter(
          (post: Post) =>
            parseDateTime(post.endDate.replace("Z", "")).compare(todayDate) < 0
        );
        break;
      case "active":
        filteredPosts = filteredPosts.filter(
          (post: Post) =>
            post.isActive &&
            parseDateTime(post.endDate.replace("Z", "")).compare(todayDate) >= 0
        );
        break;
      default:
        break;
    }

    // Check if either search term is provided and filter based on that
    if (hasSearchFilter) {
      filteredPosts = filteredPosts.filter((post) => {
        const titleLowerCase = post.title.toLowerCase();
        // Check if title matches either of the search terms
        const matchesFirstTerm = searchTerms[0]
          ? titleLowerCase.includes(searchTerms[0].toLowerCase())
          : true;
        const matchesSecondTerm = searchTerms[1]
          ? titleLowerCase.includes(searchTerms[1].toLowerCase())
          : true;

        // Post should match both of the search terms or just the first one
        // in case second term is not defined
        return matchesFirstTerm && matchesSecondTerm;
      });
    }

    // Filter by category
    if (filter.category.length > 0) {
      filteredPosts = filteredPosts.filter((post) =>
        filter.category.includes(post.category._id)
      );
    }

    // Filter by price
    if (filter.priceRange[0] || filter.priceRange[1]) {
      filteredPosts = filteredPosts.filter((post) => {
        const minPrice = filter.priceRange[0]
          ? post.price >= filter.priceRange[0]
          : true;
        const maxPrice = filter.priceRange[1]
          ? post.price <= filter.priceRange[1]
          : true;
        return minPrice && maxPrice;
      });
    }

    return filteredPosts;
  }, [hasSearchFilter, items, searchTerms, filter, solapaSelected]);

  // Sorting logic
  const sortedItems = useMemo(() => {
    if (!sortDescriptor.column) {
      return filteredItems;
    }

    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  return {
    searchTerms,
    setSearchTerms,
    sortDescriptor,
    setSortDescriptor,
    filter,
    setFilter,
    sortedItems,
    solapaSelected,
    setSolapaSelected,
  };
};
