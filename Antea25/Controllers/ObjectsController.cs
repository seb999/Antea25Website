using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Antea25.Data;
using Antea25.Models;
using Microsoft.AspNetCore.Mvc;

namespace Antea25.Controllers
{
    public class ObjectsController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public ObjectsController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }
        public IActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();
            }
            return RedirectToAction("Login", "Account");
        }

        ///If called by App, we need to pass the userId as argument
        [HttpGet]
        [Route("/api/[controller]/getObjectsList/{userId}")]
        public List<TrackedObject> GetObjectsList(string userId)
        {
            if (User.Identity.IsAuthenticated)
            {
                return DbContext.TrackedObject
                    .Where(p => p.UserId == User.Claims.FirstOrDefault().Value)
                    .Where(p=>p.Device.DeviceIsDeleted.GetValueOrDefault() != true)
                    .OrderBy(p => p.TrackedObjectName).ToList();
            }
            else
            {
                if (userId != null)
                {
                    return DbContext.TrackedObject
                        .Where(p => p.UserId == userId)
                        .Where(p => p.Device.DeviceIsDeleted.GetValueOrDefault() != true)
                        .OrderBy(p => p.TrackedObjectName).ToList();
                }
            }
            return null;
        }

        ///If called by App, we need to pass the userId as argument
        [HttpPost]
        [Route("/api/[controller]/SaveDevice")]
        public List<Device> SaveDeviceList([FromBody] Device device)
        {
            device.UserId = User.Claims.FirstOrDefault().Value;
            DbContext.Add(device);
            DbContext.SaveChanges();
            return null;
        }
    }
}