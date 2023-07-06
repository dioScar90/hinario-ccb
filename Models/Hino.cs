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
        public string HinoId { get; set; }
        [FirestoreProperty]
        public string Author { get; set; }
        [FirestoreProperty]
        public int Number { get; set; }
        [FirestoreProperty]
        public string Title { get; set; }
        [FirestoreProperty]
        public Tonality Tonality { get; set; }
        // [FirestoreProperty]
        // public DateTime CreatedAt { get; set; }
        // [FirestoreProperty]
        // public DateTime UpdatedAt { get; set; }
        // [FirestoreProperty]
        // public Boolean IsActive { get; set; }
    }
}