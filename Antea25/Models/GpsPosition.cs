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
        public decimal GpsPositionLatitude { get; set; }
        public decimal GpsPositionLongitude { get; set; }
        public DateTime GpsPositionDate { get; set; }

        public string GpsPositionLatitudeRaw { get; set; }
        public string GpsPositionLongitudeRaw { get; set; }

         public Device Device { get; set; }
    }
}
