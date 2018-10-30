using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antea25.Models
{
    public class HistoryRequest
    {
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }

        public int? DeviceId { get; set; }

        //public int? trackedObjectId { get; set; }

    }
}
