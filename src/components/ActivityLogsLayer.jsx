import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ActivityLogApi from "../Api/ActivityLogApi";
import { toast } from "react-toastify";
import usePermissions from "../hook/usePermissions";
import TablePagination from "./TablePagination";

const ActivityLogsLayer = () => {
  const { hasPermission } = usePermissions();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearchTerm(searchTerm); }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, debouncedSearchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
          page: currentPage,
          limit: rowsPerPage,
          search: debouncedSearchTerm
      };
      const response = await ActivityLogApi.getLogs(params);
      if (response && response.status && response.response.data) {
        setData(response.response.data);
        setTotalRecords(response.response.total || response.response.data.length || 0);
      } else {
        setData([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <h6 className="text-primary-600 pb-2 mb-0">Activity Logs</h6>
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
            <input type="text" className="bg-base h-40-px w-auto" name="search" placeholder="Search User..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
      </div>
      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>S.No</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Date & Time</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>User Name</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Phone Number</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Role</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>IP Address</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Browser</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4">Data loading...</td></tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{currentPage * rowsPerPage + index + 1}</td>
                    <td>{item.loginAt ? new Date(item.loginAt).toLocaleString() : "-"}</td>
                    <td><span className="text-md mb-0 fw-normal text-secondary-light">{item.userName || "-"}</span></td>
                    <td>{item.phoneNumber || "-"}</td>
                    <td><span className="badge bg-primary-focus text-primary-main px-24 py-4 radius-4">{item.userType || "-"}</span></td>
                    <td>{item.ipAddress || "-"}</td>
                    <td>{item.browserName || "-"}</td>
                    <td>
                      <span className={`badge ${item.status === 'SUCCESS' ? "bg-success-focus text-success-600" : "bg-danger-focus text-danger-600"} px-24 py-4 radius-4 fw-medium text-sm`}>
                        {item.status || "UNKNOWN"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" className="text-center py-4">No Data Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }} totalRecords={totalRecords} />
        )}
      </div>
    </div>
  );
};

export default ActivityLogsLayer;
