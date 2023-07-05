using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace hinario_ccb.Models
{
    [FirestoreData]
    public class Hino
    {
        public string Id { get; set; }
        public string Author { get; set; }
        public int Number { get; set; }
        public string Title { get; set; }
        public Tonality Tonality { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Boolean IsActive { get; set; }
    }
}