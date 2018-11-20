using Microsoft.AspNet.Identity;
using MVCDemo.Models;
using QR_Projekt.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web;
using System.Web.Http;

namespace MVCDemo.Controllers
{
    public class EmployeesController : ApiController
    {
        List<Employee> employees { get; set; }

        DBConnection DB = new DBConnection();
        //Contructor Opretter liste med Employee fra databasen
        public EmployeesController()
        {
            employees = new List<Employee>();
            DataSet ds = DB.Query("SELECT * FROM employee");
            foreach (DataRow Row in ds.Tables[0].Rows)
            {
                Console.WriteLine(Convert.ToInt32(Row[0]));
                employees.Add(new Employee()
                {
                    Id = Convert.ToInt32(Row[0]),
                    Name = Row[1].ToString(),
                    Email = Row[3].ToString(),
                    Phone = Row[2].ToString(),
                    Image = Row[4].ToString(),
                    ContactEmail = Row[5].ToString()
                });
            }
        }
        //Get metode som returnerer alle employees
        [Authorize]
        public IEnumerable<Employee> GetAllEmployees()
        {
            return employees;
        }

        //Get metode som returnere en enkel employee ud fra et id
        [AllowAnonymous]
        [HttpGet]
        public IHttpActionResult GetEmployee(int id)
        {
            var employee = employees.Find(ByID(id));
            if (employee == null)
            {
                return NotFound();
            }
            return Ok(employee);
        }

        //Put metode som opdaterer en employee i databasen uden at opdatere billede
        [HttpPut]
        [Authorize]
        public IHttpActionResult UpdateEmployee([FromBody]Employee employee)
        {

            int error = DB.NonQuery($"UPDATE employee SET NAME = '{employee.Name}', PHONE = '{employee.Phone}', EMAIL = '{employee.Email}', CONTACTEMAIL = '{employee.ContactEmail}' WHERE ID = {employee.Id}");
            if (error == -1)
                return NotFound();
            return Ok(employee);
        }

        //Post metode som opretter en ny employee men uden et billede
        [HttpPost]
        [Authorize]
        public IHttpActionResult CreateEmployee([FromBody]Employee employee)
        {
            int id = DB.ScalarQuery($"INSERT INTO employee OUTPUT INSERTED.ID VALUES('{employee.Name}', '{employee.Phone}', '{employee.Email}','','{employee.ContactEmail}')");
            employee.Id = id;
            return Ok(employee);
        }
        //Delete metode som sletter en employee
        [HttpDelete]
        [Authorize]
        public IHttpActionResult DeleteEmployee([FromBody]Employee employee)
        {
            int error = DB.NonQuery($"DELETE FROM employee WHERE ID = {employee.Id}");
            if (error == -1)
                return NotFound();
            return Ok("Deleted");
        }
        //post metode som sender mail til tec ansat og bruger
        [Route("api/sendmail")]
        [HttpPost]
        public IHttpActionResult SendMail([FromBody]MailFields mailFields)
        {
            //her skal der sendes en mail fra en tec mail (måske en noreply mail) til 
            //brugeren og den tec ansatte. Hvis den tec ansatte har en kontakt email i databasen skal der sendes til den mail istedet for

            //til at teste loading bar på side
            //Thread.Sleep(10000);




            return Ok(mailFields);
        }

        //Post metode som bruges til at uploade et billede til serveren og lægge det i en mappe i content og taste stien ind i databasen
        [Route("api/imageupload")]
        [Authorize]
        [HttpPost]
        public IHttpActionResult ImageUpload()
        {
            var request = HttpContext.Current.Request;
            var Id = request.Headers["Id"];
            var path = HttpRuntime.AppDomainAppPath;
            var filePath = path + @"Content\Images\" + Id + request.Headers["filename"];
            using (var fs = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
            {
                request.InputStream.CopyTo(fs);
            }
            DB.ScalarQuery($"UPDATE employee SET IMAGE = '{ "Content/Images/" + Id + request.Headers["filename"]}' WHERE ID = {Id}");
            return Ok("uploaded");
        }
        //get metode som henter alle brugere til systemet pånær den bruger som er logget ind
        [Route("api/users")]
        [Authorize]
        [HttpGet]
        public IHttpActionResult GetUsers()
        {

            List<UserModel> userModels = new List<UserModel>();
            DataSet ds = DB.Query("SELECT Id,Email FROM AspNetUsers");
            foreach (DataRow Row in ds.Tables[0].Rows)
            {
                if (User.Identity.GetUserId() == Row[0].ToString())
                    continue;
                userModels.Add(new UserModel
                {
                    Id = Row[0].ToString(),
                    Email = Row[1].ToString()
                });
            }
            return Ok(userModels);
        }
        //post metode som sletter en bruger ud fra id
        [Route("api/users")]
        [Authorize]
        [HttpPost]
        public IHttpActionResult DeleteUser()
        {
            var request = HttpContext.Current.Request;
            string Id = request.Headers["Id"];
            if (User.Identity.GetUserId() == Id)
                return NotFound();
            DB.NonQuery($"DELETE FROM AspNetUsers WHERE Id = '{Id}'");
            return Ok(Id);
        }


        Predicate<Employee> ByID(int ID)
        {
            return delegate (Employee employee)
            {
                return employee.Id == ID;
            };
        }
    }
}
