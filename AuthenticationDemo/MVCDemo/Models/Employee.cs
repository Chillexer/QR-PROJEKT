using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace QR_Projekt.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ContactEmail { get; set; }
        public string Phone { get; set; }
        public string Image { get; set; }

        public Employee(int Id)
        {
            DBConnection dB = new DBConnection();
            DataSet ds = dB.Query($"SELECT * FROM employee WHERE ID = {Id}");
        }

        public Employee()
        {
        }
        public static Predicate<Employee> ByID(int ID)
        {
            return delegate (Employee employee)
            {
                return employee.Id == ID;
            };
        }
    }
}