import { getSearchURL } from "@/utils/functions/formatUrls";
import { Input, Button, Chip } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";

const SearchPosts = ({
  searchTerms,
  setSearchTerms,
  isMultiSearch = false, // New prop to toggle multi-search functionality
  dontPushSearch = false,
}: {
  searchTerms: (string | undefined)[] | string;
  setSearchTerms: any;
  isMultiSearch?: boolean; // Optional prop to toggle single or multi-search
  dontPushSearch?: boolean;
}) => {
  const [currentTerm, setCurrentTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams();

  // Handler to add a search term (only used for multi-search)
  const handleAddTerm = () => {
    if (dontPushSearch) {
      setSearchTerms((prev: any) => [...prev, currentTerm]);
      setCurrentTerm("");
      return;
    }
    if (queryParams.get("busqueda")) {
      if (!isMultiSearch) {
        const searchUrl = getSearchURL(pathname, currentTerm);
        if (searchUrl) {
          router.push(searchUrl);
        }
        return;
      }
      if (currentTerm && searchTerms.length < 2) {
        setSearchTerms((prev: any) => [...prev, currentTerm]);
        setCurrentTerm(""); // Reset input after adding
      }
      return;
    }
    const searchUrl = getSearchURL(pathname, currentTerm);
    if (searchUrl) {
      router.push(searchUrl);
    }
  };

  // Handler to delete a search term (only used for multi-search)
  const handleDeleteTerm = (index: number) => {
    setSearchTerms((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 items-center">
        <Input
          aria-label="buscar"
          variant="bordered"
          radius="full"
          startContent={<FaSearch className="text-light-text min-w-3.5" />}
          value={currentTerm}
          onValueChange={setCurrentTerm}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              ((isMultiSearch &&
                queryParams.get("busqueda") &&
                currentTerm &&
                searchTerms.length < 2) ||
                currentTerm)
            ) {
              handleAddTerm();
            }
          }}
          placeholder={
            isMultiSearch && queryParams.get("busqueda")
              ? "Ingrese un término para filtrar los resultados..."
              : "Ingrese un término para buscar..."
          }
          // Disable input when there are 2 search terms (in multi-search mode)
          isDisabled={searchTerms.length >= 2}
          className="flex-1"
          classNames={{
            inputWrapper: `border-[0.5px] pr-0 group-data-[focus=true]:border-light-text 
            data-[hover=true]:border-light-text focus-within:border-[0.5px] min-h-6 max-lg:h-9`,
            input: "md:ml-1 text-xs md:text-sm",
          }}
          endContent={
            isMultiSearch && queryParams.get("busqueda") ? (
              <Button
                variant="ghost"
                size="sm"
                color="secondary"
                radius="full"
                className="px-3 min-w-fit h-[106%] -mr-[1px]"
                onPress={handleAddTerm}
                isDisabled={searchTerms.length >= 2 || !currentTerm}
                startContent={<FaPlus />}
              >
                <span className="max-md:hidden">Filtrar búsqueda</span>
                <span className="md:hidden">Filtrar</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                color="secondary"
                radius="full"
                className="px-3 min-w-fit h-[106%] -mr-[1px]"
                onPress={handleAddTerm}
                isDisabled={!currentTerm}
                startContent={<FaSearch />}
              >
                Buscar
              </Button>
            ) // No add button if single search mode is enabled
          }
        />
      </div>

      {/* Display added search terms in multi-search mode */}
      {isMultiSearch && searchTerms.length > 0 && (
        <div className="text-xs md:text-sm text-light-text flex gap-1">
          {(searchTerms as string[]).map((term, index) => (
            <Chip
              size="sm"
              as={Button}
              color="default"
              variant="bordered"
              key={index}
              onPress={() => handleDeleteTerm(index)}
              startContent={<FaTimes className="text-gray-500" />}
            >
              {term}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPosts;
