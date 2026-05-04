import React, { useState, useEffect } from "react";
import "../../assets/css/components/tables.css";
import {
    useFloating,
    offset,
    flip,
    shift,
    autoUpdate,
    useDismiss,
    useInteractions,
} from "@floating-ui/react";

function GenericTable({
    columns,
    fetchData,
    pageSize = 10, // default rows per page
    searchable = true,
    filterConfig = [],
    searchPlaceholder = "Search..."
}) {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({
        total: 0,
        perPage: pageSize,
        currentPage: 1,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(pageSize);

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const dismiss = useDismiss(context);
    const { getReferenceProps } = useInteractions([dismiss]);

    // --------------------
    // Debounce search
    // --------------------
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    // --------------------
    // Fetch data from API
    // --------------------
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await fetchData({
                    page,
                    limit: rowsPerPage,
                    search: debouncedSearch,
                    filters,
                });

                setData(res.data || []);
                setPagination({
                    total: res.pagination?.total || 0,
                    perPage: res.pagination?.perPage || rowsPerPage,
                    currentPage: res.pagination?.currentPage || page,
                    totalPages: res.pagination?.totalPages || 1,
                });
            } catch (err) {
                console.error("Failed to load table data", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [page, debouncedSearch, filters, rowsPerPage, fetchData]);

    // --------------------
    // Toggle filters
    // --------------------
    const toggleFilter = (key, value) => {
        setPage(1);
        setFilters((prev) => {
            const current = prev[key] || [];
            return {
                ...prev,
                [key]: current.includes(value)
                    ? current.filter((v) => v !== value)
                    : [...current, value],
            };
        });
    };

    // --------------------
    // Pagination helpers
    // --------------------
    const getPageNumbers = () => {
        const maxVisible = 10;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = start + maxVisible - 1;
        if (end > pagination.totalPages) {
            end = pagination.totalPages;
            start = Math.max(1, end - maxVisible + 1);
        }

        const pages = [];
        for (let p = start; p <= end; p++) pages.push(p);
        return pages;
    };

    // Check if there's any data (including when searching/filtering)
    const hasActiveSearch = debouncedSearch.trim() !== "";
    const hasActiveFilters = Object.values(filters).flat().length > 0;

    const showControls =
        pagination.total > 0 || hasActiveSearch || hasActiveFilters;

    return (
        <div className="overflow-x-auto">
            {/* Search + Filters - Only show if there's data */}
            {showControls && (
                <div className="flex justify-between items-center mb-3">
                    {searchable && (
                        <div className="relative w-80">
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border px-3 py-2 rounded text-sm w-full pr-8"
                            />
                            {search && (
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setDebouncedSearch("");
                                        setPage(1);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black-400 hover:text-black-600"
                                >
                                    &#10005; {/* X icon */}
                                </button>
                            )}
                        </div>
                    )}

                    {filterConfig.length > 0 && (
                        <div className="relative inline-block">
                            <button
                                ref={refs.setReference}
                                {...getReferenceProps()}
                                onClick={() => setOpen((v) => !v)}
                                className="border px-4 py-2 rounded text-sm bg-white"
                            >
                                Filters
                                {Object.values(filters).flat().length > 0 && (
                                    <span className="ml-2 text-xs bg--active-500 text-white px-2 rounded">
                                        {Object.values(filters).flat().length}
                                    </span>
                                )}
                            </button>

                            {open && (
                                <div
                                    ref={refs.setFloating}
                                    style={floatingStyles}
                                    className="w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4"
                                >
                                    {filterConfig.map((filter) => (
                                        <div key={filter.key} className="mb-4">
                                            <p className="text-sm font-semibold mb-2">{filter.label}</p>
                                            {filter.options.map((opt) => (
                                                <label
                                                    key={opt.value}
                                                    className="flex items-center gap-2 text-sm px-3"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={filters[filter.key]?.includes(opt.value) || false}
                                                        onChange={() => toggleFilter(filter.key, opt.value)}
                                                    />
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    ))}

                                    <div className="flex justify-between pt-2 border-t">
                                        <button
                                            onClick={() => setFilters({})}
                                            className="text-sm text-red-500 pt-1"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="table--wrapper">
                <table className="min-w-full rounded">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-2 text-sm font-semibold text-gray-700 ${col.headerClass || ""}`}
                                    style={{ width: col?.width }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5 text-gray-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        <span>Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4 text-gray-500 no--data-wrapper">
                                    <div className="no--data">No data found</div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={row.id || idx} className="border-b hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-2 text-sm text-gray-600">
                                            {col.render ? col.render(row, idx) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Only show if there's data */}
            {showControls && (
                <div className="flex justify-between items-center text-sm pagination--wrapper">
                    {/* Showing X-Y of Z */}
                    <div>
                        {data.length > 0
                            ? `Showing ${(pagination.currentPage - 1) * rowsPerPage + 1}-${(pagination.currentPage - 1) * rowsPerPage + data.length
                            } of ${pagination.total}`
                            : `Showing 0 of ${pagination.total}`}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Rows per page */}
                        <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value));
                                    setPage(1);
                                }}
                                className="border p-1 rounded text-sm"
                            >
                                {[10, 20, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Page numbers */}
                        <div className="flex gap-1 items-center">
                            {/* Previous button */}
                            <button
                                onClick={() => page > 1 && setPage(page - 1)}
                                disabled={page === 1}
                                className="px-2 py-1 disabled:opacity-50"
                            >
                                &lt;
                            </button>

                            {/* Page number buttons */}
                            {getPageNumbers().map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-2 py-1 border rounded ${p === page ? "bg--active-500 text-white" : "bg-white text-gray-700"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}

                            {/* Next button */}
                            <button
                                onClick={() => page < pagination.totalPages && setPage(page + 1)}
                                disabled={page === pagination.totalPages}
                                className="px-2 py-1 disabled:opacity-50"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GenericTable;