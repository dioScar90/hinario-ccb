using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using hinario_ccb.Models;

namespace hinario_ccb.Controllers
{
    public class HinosController : Controller
    {
        private readonly IConfiguration _config;
        // private string ConnectionString;
        private string path = "C:\\xampp\\htdocs\\diogo\\hinario-ccb\\hinario-ccb-c94f3-f4664402416c.json";
        // readonly string projectId = builder.Configuration.GetValue<string>("project_id");
        readonly string projectId;
        private FirestoreDb _firestoreDb;

        public HinosController(IConfiguration config)
        {
            _config = config;
            projectId = _config["Configurations:project_id"];
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATIONS_CREDENTIALS", path);
            // projectId = "hinario-ccb-c94f3";
            _firestoreDb = FirestoreDb.Create(projectId);
        }

        public async Task<IActionResult> Index()
        {
            Query hinosQuery = _firestoreDb.Collection("hinos");
            QuerySnapshot hinosQuerySnapshot = await hinosQuery.GetSnapshotAsync();
            List<Hino> hinosList = new();

            foreach (DocumentSnapshot documentSnapshot in hinosQuerySnapshot.Documents)
            {
                if (documentSnapshot.Exists)
                {
                    Dictionary<string, object> hino = documentSnapshot.ToDictionary();
                    string json = JsonConvert.SerializeObject(hino);
                    Hino newHino = JsonConvert.DeserializeObject<Hino>(json);
                    newHino.Id = documentSnapshot.Id;
                    hinosList.Add(newHino);
                }
            }

            return View(hinosList);
        }
    }
}