# QR PROJEKT

# Database Adgang
  Database Forbindelsen er sat i web.config under det som hedder ConnectionStrings
  Eksempel: 
  \<add name="DefaultConnection" connectionString="Data Source=192.168.4.140;Initial Catalog=QR;User id=sa;Password=Passw0rd;" providerName="System.Data.SqlClient" \/\>

# Login Oplysninger
  Standard Login til hjemmeside er
  Brugernavn: admin@admin.dk
  Kode: Passw0rd

# IIS SERVER CONFIG
  1. App Pool skal have adgang til at modificere Content mappen og alle underliggende mapper
  2. Der skal gives adgang til Directory Browsing for Content Mappen

# Test Side Adgang
  URL til side: http://188.179.204.156:4000
  URL til en testkontakt: http://188.179.204.156:4000/Home/Contact/4
  Maks længde for nr og email er 15 karakterer. Navnet kan ikke indeholde mere end 15 karaktere per navn i navnet.
  Standard Login til hjemmeside er
  Brugernavn: admin@admin.dk
  Kode: Passw0rd
