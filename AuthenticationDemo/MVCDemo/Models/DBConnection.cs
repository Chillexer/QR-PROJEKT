using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace QR_Projekt.Models
{
    public class DBConnection
    {
        public SqlConnection connection { get; set; }

        public DBConnection()
        {
            string cs = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            connection = new SqlConnection(cs);

            //"Data Source = 192.168.4.140; " +
            //"Initial Catalog=QR;" +
            //"User id=sa;" +
            //"Password=Passw0rd;"
        }
        public DataSet Query(string sql)
        { 
            return GetDataSet(sql);
        }
        public int NonQuery(string sql)
        {
            SqlCommand cmd = new SqlCommand(sql, connection);
            try
            {
                cmd.Connection.Open();
                return cmd.ExecuteNonQuery();
            }
            catch
            {
                return -1;
            }
            finally
            {
                cmd.Connection.Close();
            }

        }
        public int ScalarQuery(string sql)
        {
            //try
            //{
            SqlCommand cmd = new SqlCommand(sql, connection);
            try
            {
                cmd.Connection.Open();
                return (Int32)cmd.ExecuteScalar();
            }
            catch
            {
                return -1;
            }
            finally
            {
                cmd.Connection.Close();
            }
               
            //}
            //catch
            //{
            //    return -1;
            //}
        }

        DataSet GetDataSet(string sqlCommand)
        {
            DataSet ds = new DataSet();
            using (SqlCommand cmd = new SqlCommand(
                sqlCommand, connection))
            {
                cmd.Connection.Open();
                DataTable table = new DataTable();
                table.Load(cmd.ExecuteReader());
                ds.Tables.Add(table);
                cmd.Connection.Close();
            }
            return ds;
        }
    }
}