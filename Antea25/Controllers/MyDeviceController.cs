using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Antea25.Data;
using Antea25.Models;
using Microsoft.AspNetCore.Mvc;

namespace Antea25.Controllers
{
    public class MyDeviceController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public MyDeviceController([FromServices] ApplicationDbContext appDbContext)
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
        [Route("/api/[controller]/GetDeviceList/{userId}")]
        public List<Device> GetDeviceList(string userId)
        {
            if (User.Identity.IsAuthenticated)
            {
                return DbContext.Device
                    .Where(p => p.UserId == User.Claims.FirstOrDefault().Value)
                    .Where(p=>p.DeviceIsDeleted.GetValueOrDefault() != true)
                    .OrderBy(p => p.DateAdded).ToList();
            }
            else
            {
                if (userId != null)
                {
                    return DbContext.Device
                        .Where(p => p.UserId == User.Claims.FirstOrDefault().Value)
                        .Where(p => p.DeviceIsDeleted.GetValueOrDefault() != true)
                        .OrderByDescending(p => p.DateAdded).ToList();
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