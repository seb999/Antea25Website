using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antea25.Models
{
    public partial class Device
    {
        public Device(){
            GpsPosition = new HashSet<GpsPosition>();
        }
        
        public int DeviceId { get; set; }
        public string UserId { get; set; }

        public ICollection<GpsPosition> GpsPosition { get; set; }
    }
}