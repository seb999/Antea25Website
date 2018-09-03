using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antea25.Models
{
    public partial class TrackedObject
    {
        public TrackedObject()
        {
            GpsPosition = new HashSet<GpsPosition>();
        }
        public int TrackedObjectId { get; set; }
        public string UserId { get; set; }
        public string TrackedObjectName { get; set; }
        public string TrackedObjectColor { get; set; }
        public int DeviceId { get; set; }
        public Device Device { get; set; }
        public ICollection<GpsPosition> GpsPosition { get; set; }
    }
}
