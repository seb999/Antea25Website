using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antea25.Models
{
    public class HistoryRequest
    {
        public DateTime? start { get; set; }
        public DateTime? end { get; set; }

        public int? trackedObjectId { get; set; }

    }
}
