import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import FilterButton from "../components/ui/FilterButton";
import Pagination from "../components/ui/Pagination";
import RequestsTable, { EmptyRequests } from "../components/dashboard/RequestsTable";
import BulkBar from "../components/dashboard/BulkBar";
import { statusInfo } from "../data/requests";
import { formatAmount } from "../utils/formatAmount";
import type { useLoanRequests } from "../hooks/useLoanRequests";

type RequestsPageProps = ReturnType<typeof useLoanRequests> & {
  onRowClick: (id: string) => void;
};

export default function RequestsPage({
  requests,
  visibleRequests,
  pagedRequests,
  activeStatus,
  search,
  sort,
  page,
  pageSize,
  pageCount,
  selectedIds,
  revertibleCount,
  setSearch,
  setActiveStatus,
  toggleSort,
  setPage,
  setPageSize,
  toggleSelection,
  toggleAllOnPage,
  moveRequest,
  revertRequest,
  bulkMove,
  bulkRevert,
  onRowClick,
}: RequestsPageProps) {
  const subtitle =
    activeStatus === "all"
      ? "همه مراحل گردش کار"
      : `درخواست‌های مرحله «${statusInfo[activeStatus].label}»`;

  return (
    <>
      <PageHeader
        title="درخواست‌های تسهیلات"
        description={`${subtitle} · جست‌وجو، فیلتر و انتقال گروهی درخواست‌ها`}
        action={
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 border border-brand-100">
            <span className="text-[11px] text-brand-700">نتیجه فعال</span>
            <span className="text-sm font-extrabold text-brand-700 tabular-nums">
              {formatAmount(visibleRequests.length)}
            </span>
            <span className="text-[10px] text-brand-500">
              از {formatAmount(requests.length)}
            </span>
          </div>
        }
      />

      {/* نوار ابزار چسبان: همیشه بالای جدول دیده می‌شود */}
      <div className="sticky top-16 z-20 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 bg-slate-100/90 backdrop-blur-sm">
        <div className="flex flex-row items-center gap-2 sm:gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex-1 min-w-0">
            <SearchInput
              value={search}
              onChange={setSearch}
              resultCount={visibleRequests.length}
            />
          </div>

          <div className="shrink-0">
            <FilterButton
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
            />
          </div>
        </div>
      </div>

      {/* جدول + صفحه‌بندی */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <BulkBar
          selectedCount={selectedIds.length}
          revertibleCount={revertibleCount}
          onBulkMove={bulkMove}
          onBulkRevert={bulkRevert}
        />

        {pagedRequests.length === 0 ? (
          <EmptyRequests hasSearch={search.trim() !== ""} />
        ) : (
          <RequestsTable
            rows={pagedRequests}
            selectedIds={selectedIds}
            sort={sort}
            onToggleSort={toggleSort}
            onToggleSelection={toggleSelection}
            onToggleAll={toggleAllOnPage}
            onMove={moveRequest}
            onRevert={revertRequest}
            onView={onRowClick}
            onRowClick={onRowClick}
          />
        )}

        <Pagination
          page={page}
          pageCount={pageCount}
          pageSize={pageSize}
          total={visibleRequests.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </section>
    </>
  );
}