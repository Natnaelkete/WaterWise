"use client";

import { Report, ReportStatus, ReportType, User } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import InfiniteScroll from "react-infinite-scroll-component";

type sessionType = {
  user: User;
  expires: string;
};

const Dashboard = ({ session }: { session: sessionType }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<ReportType | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const limit = Number(process.env.LIMITS) || 10;

  const isAdmin = session?.user?.role === "ADMIN";

  const router = useRouter();

  useEffect(() => {
    fetchReports(true);
  }, []);

  useEffect(() => {
    setReports([]);
    setPage(1);
    setHasMore(true);
    fetchReports(true);
  }, [filter, typeFilter]);

  const fetchReports = async (initialLoad = false) => {
    try {
      const response = await fetch(
        `/api/reports?page=${initialLoad ? 1 : page}&limit=${limit}${
          filter !== "ALL" ? `&status=${filter}` : ""
        }${typeFilter !== "ALL" ? `&type=${typeFilter}` : ""}`
      );
      const { data: newItems, hasMore: moreAvailable } = await response.json();

      if (initialLoad) {
        setReports(newItems);
        setPage(2);
        setIsLoading(false);
      } else {
        setReports((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }

      setHasMore(moreAvailable);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
      setHasMore(false);
      if (initialLoad) {
        setIsLoading(false);
      }
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        await fetchReports();
        toast({
          title: "Couldn't delete the report",
          variant: "destructive",
        });
        return;
      }

      setReports((prev) => prev.filter((report) => report.id !== id));
      toast({
        title: "Report deleted successfully",
        variant: "default",
      });
    } catch (error) {
      // Revert optimistic update by refetching reports
      startTransition(async () => {
        await fetchReports();
      });
      console.error("Error deleting report:", error);
      toast({
        title: "Error deleting report",
        variant: "destructive",
      });
    }
  };

  const updateReportStatus = async (
    reportId: string,
    newStatus: ReportStatus
  ) => {
    try {
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );

      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Revert if the API call fails
        await fetchReports();
      }
    } catch (error) {
      console.error("Error updating report:", error);
      // Revert if there's an error
      await fetchReports();
    }
  };
  const filteredReports = reports.filter((report) => {
    const statusMatch = filter === "ALL" || report.status === filter;
    const typeMatch = typeFilter === "ALL" || report.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusColor = (status: ReportStatus) => {
    const colors = {
      PENDING: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
      RESOLVED: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
      DISMISSED:
        "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
    };
    return colors[status];
  };

  if (isLoading || isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as ReportStatus | "ALL")
              }
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(ReportStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as ReportType | "ALL")
              }
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            >
              <option value="ALL">All Types</option>
              {Object.values(ReportType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="text-neutral-400">
            {filteredReports.length} Reports
          </div>
        </div>

        <div className="grid gap-4">
          <InfiniteScroll
            dataLength={filteredReports.length}
            next={fetchReports}
            hasMore={hasMore}
            loader={
              <div className="p-4 text-center text-gray-500">
                Loading more items...
              </div>
            }
            endMessage={
              <p className="p-4 text-center text-gray-500">
                You've reached the end of the list
              </p>
            }
            className="grid gap-4"
          >
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-all"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-medium text-neutral-200">
                        Status
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-sm">
                      {report.description}
                    </p>
                    <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                        </div>
                        {report.type}
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                        </div>
                        {`${report.latitude} ${report.longitude}` || "N/A"}
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                        </div>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {report.image && (
                      <Image
                        width={20}
                        height={20}
                        src={report.image}
                        alt="Report"
                        className="mt-4 w-20 h-20 rounded-lg border border-neutral-800"
                      />
                    )}
                  </div>
                  <select
                    value={report.status}
                    onChange={(e) =>
                      startTransition(async () => {
                        await updateReportStatus(
                          report.id,
                          e.target.value as ReportStatus
                        );
                      })
                    }
                    className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  >
                    {Object.values(ReportStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <div className="cursor-pointer">
                    <MapPin
                      className="text-white/80 hover:text-white/50 transition-colors"
                      onClick={() =>
                        router.push(
                          `/dashboard/map?lat=${report.latitude}&lng=${report.longitude}`
                        )
                      }
                    />
                  </div>
                  {isAdmin && (
                    <div className="cursor-pointer">
                      <TrashIcon
                        className="text-red-700 hover:text-red-500 transition-colors"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this report?"
                            )
                          ) {
                            startTransition(async () => {
                              await deleteReport(report.id);
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </InfiniteScroll>
          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-neutral-500 bg-neutral-900/50 rounded-xl border border-neutral-800">
              No reports found matching the selected filters.
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
