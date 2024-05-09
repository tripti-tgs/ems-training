import React, { useEffect, useState, useCallback } from "react";
import http from "../services/httpService";
import { Button, Alert } from "antd";
import { Link, useNavigate } from "react-router-dom";
import EmployeeTable from "./EmployeeTable";
import EmployeeSearch from "./EmployeeSearch";

const ShowEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [info, setInfo] = useState(null);
  const [search, setSearch] = useState(null);
  const navigate = useNavigate();

  let token =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4OEQ2QTc4QjM0QjU5QzE1RTQxQUM0QTZCOTVEQzhGIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3MTUyMzU1NzQsImV4cCI6MTcxNTIzOTE3NCwiaXNzIjoiaHR0cHM6Ly8xOTIuMTY4LjAuMTQzOjQ0NDAiLCJhdWQiOlsiUTJDQVBJIiwiSWRlbnRpdHlTZXJ2ZXJBUEkiXSwiY2xpZW50X2lkIjoiUTJDIFVJIiwic3ViIjoiY2ZjNTExYmYtOWZkOC00M2E4LWJlMDUtNmJjZDU5NWYyNzI0IiwiYXV0aF90aW1lIjoxNzE1MjM1NTcxLCJpZHAiOiJsb2NhbCIsInVzZXJpZCI6ImNmYzUxMWJmLTlmZDgtNDNhOC1iZTA1LTZiY2Q1OTVmMjcyNCIsImVtYWlsIjoiIiwicm9sZSI6IiIsIlBob25lIjoiIiwic2lkIjoiMkU1NzJGODFENDk4N0Q0MkQ2NjM1RjBCMUNBNjkzNkYiLCJpYXQiOjE3MTUyMzU1NzQsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJJZGVudGl0eVNlcnZlckFQSSIsIlEyQ0Zyb250RW5kIiwiUTJDUmVwb3J0RGVzaWduZXIiLCJRMkNSZXBvcnRWaWV3ZXIiXSwiYW1yIjpbInB3ZCJdfQ.tybErfY8fz2EDcX_aNx-HcFae0Ue30V87N810m1iI8pnuPwV9M-Jt7TfEqbcPEvfRRK2Y61qE2XRGpInYFRu_Si23k5gnMUcdivN6t6Pigj4W5xLCsHg6niBIpmOQNzydoDWd7yLx1WDbjptfDr0B5C58ylLDhFKsTmEGsgQ0U3XQzYbyepd2hTKj4qpUXlYpaOWculx7Znl8lqCaLMPvbu69dbQTRx78l4FCZILn5gh-5wmsJtWdy0sdSs2Ss5rlO0NFlE4ceayxk9_SoY5uDPX0n7vkey8jNZtJGVaYb2RLQDkDNrQskO-TRLB7czbj3FUHig1BMIetVLMGc49XA";

    const fetchEmployees = useCallback(async () => {
      const url = search ? `/employee/empanddep${search}` : "/employee/empanddep";
      try {
        const response = await http.get(url);
        
        // Use Promise.all to await all image fetches before updating state
        const updatedResponse = await Promise.all(response.map(async (e) => {
          try {
            let imageUrl = e.emp_img;
            const imageResponse = await fetch(imageUrl, {
              headers: {
                "Authorization": token
              }
            });
            console.log(imageResponse.url)
            if (imageResponse.url.includes('/upload')) {
            const blob = await imageResponse.blob();
            imageUrl = URL.createObjectURL(blob);
            e.emp_img = imageUrl;
            }else{
              e.emp_img = ""
            }
            return e;
          } catch (error) {
            console.error("Error fetching image:", error);
            return e;
          }
        }));
    
        setEmployees(updatedResponse);
      } catch (err) {
        console.error(err);
      }
    }, [search, token, http]);
    
    useEffect(() => {
      fetchEmployees();
      return () => {
        // Revoke object URLs for all images
        employees.forEach(e => URL.revokeObjectURL(e.emp_img));
      };
    }, [search]);


  const handleDelete = useCallback(async (record) => {
    try {
      const response = await http.deleteApi(`/employee/${record.id}`);
      setInfo(response?.message);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleEdit = useCallback(
    (recordId) => {
      try {
        navigate(`/edit/${recordId}`);
      } catch (err) {
        console.error(err);
      }
    },
    [navigate]
  );

  const handleSearch = (e) => {
    const { currentTarget: input } = e;
    const str = `?search=${input.value}`;
    setSearch(str);
  };

  return (
    <div className="mt-4">
      <div className="px-5">
        <Button type="primary" className="mb-3">
          <Link to="/add" className="text-decoration-none">
            Add Employee
          </Link>
        </Button>
        <EmployeeSearch handleSearch={handleSearch} />
        {info && (
          <Alert message={info} type="success" className="mb-3 mt-3" closable />
        )}
      </div>
      <div className="p-5">
        <EmployeeTable
          employees={employees}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ShowEmployee;
