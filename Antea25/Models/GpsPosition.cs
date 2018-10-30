using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antea25.Models
{
    public class GpsPosition
    {
        public long GpsPositionId { get; set; }
        public long DeviceId { get; set; }
        public int TrackedObjectId { get; set; }
        public decimal GpsPositionLatitude { get; set; }
        public decimal GpsPositionLongitude { get; set; }
        public decimal GpsPositionSpeed { get; set; }
        public decimal GpsPositionHeading { get; set; }
        public DateTime GpsPositionDate { get; set; }

        public string GpsPositionLatitudeRaw { get; set; }
        public string GpsPositionLongitudeRaw { get; set; }

         public TrackedObject TrackedObject { get; set; }
    }
}
