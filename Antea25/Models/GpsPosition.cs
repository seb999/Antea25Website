using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antea25.Models
{
    public class GpsPosition
    {
        public int GpsPositionId { get; set; }
        public string UserId { get; set; }
        public int DeviceId { get; set; }
        public float GpsPositionLatitude { get; set; }
        public float GpsPositionLongitude { get; set; }
        public DateTime GpsPositionDate { get; set; }
    }
}
