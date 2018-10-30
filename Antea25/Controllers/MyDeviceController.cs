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

        #region Portal method

        ///Return list of device for current userId
        [HttpGet]
        [Route("/api/[controller]/GetDeviceList")]
        public List<Device> GetDeviceList()
        {
            return DbContext.Device
                    .Where(p => p.UserId == User.Claims.FirstOrDefault().Value)
                    .Where(p=>p.DeviceIsDeleted.GetValueOrDefault() != true)
                    .OrderBy(p => p.DateAdded).ToList();
        }

        ///Save a new device
        [HttpPost]
        [Route("/api/[controller]/SaveDevice")]
        public int SaveDevice([FromBody] Device device)
        {
            device.UserId = User.Claims.FirstOrDefault().Value;
            DbContext.Add(device);
            DbContext.SaveChanges();
            return DbContext.Device.Select(p=>p.DeviceId).LastOrDefault();
        }

        #endregion

        #region APP methods

        ///Get list of device for APP
        [HttpGet]
        [Route("/api/[controller]/AppGetDeviceList/{userId}")]
        public List<Device> AppGetDeviceList(string userId)
        {
            var result =  DbContext.Device
                    .Where(p => p.UserId == userId)
                    .Where(p=>p.DeviceIsDeleted.GetValueOrDefault() != true)
                    .OrderBy(p => p.DateAdded).ToList();

            return result;
        }

        #endregion
    }
}