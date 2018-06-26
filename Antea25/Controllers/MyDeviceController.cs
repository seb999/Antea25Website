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
            return View();
        }

        ///If called by App, we need to pass the userId as argument
        [HttpGet]
        [Route("/api/[controller]/GetDeviceList/{userId}")]
        public List<Device> GetDeviceList(string userId)
        {
            if (User.Identity.IsAuthenticated)
            {
                return DbContext.Device.Where(p => p.UserId == User.Claims.FirstOrDefault().Value).OrderByDescending(p => p.DeviceId).ToList();
            }
            else
            {
                if (userId != null)
                {
                    return DbContext.Device.Where(p => p.UserId == User.Claims.FirstOrDefault().Value).OrderByDescending(p => p.DeviceId).ToList();
                }
            }
            return null;
        }

        ///If called by App, we need to pass the userId as argument
        [HttpGet]
        [Route("/api/[controller]/SaveDeviceList/{userId}")]
        public List<Device> SaveDeviceList(string userId)
        {
            return null;
        }
    }
}