using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Antea25.Data;
using Antea25.Models;

namespace Antea25.Controllers
{
    public class LocController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public LocController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
            //var userId = User.Claims.FirstOrDefault().Value;
        }

        // GET: Localisation
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();
            }
            return RedirectToAction("Login", "Account");
        }

        ///Check if sensor is moving for APP
        /// usage example : host/api/Loc/IsSensorMoving/a17767b1-820f-4f0b-948b-acd9cd1a242a/2016-12-01T00:00:00
        [HttpGet]
        [Route("/api/[controller]/GetMotion/{userId}/{fromThisDate}")]
        public bool GetMotion(string userId, DateTime fromThisDate)
        {
            if(DbContext.Users.Where(p=>p.Id == userId).FirstOrDefault()==null)
                return false;
            
            if (DbContext.GpsPosition.Where(p=>p.UserId==userId && DateTime.Compare(p.GpsPositionDate, fromThisDate) >0).Count() >0)
            return true;
            else
            return false;
        }

        /// <summary>
        /// usage example : host/api/Loc/a17767b1-820f-4f0b-948b-acd9cd1a242a/123/456
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="latitude"></param>
        /// <param name="longitude"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("/api/[controller]/{userId}/{latitude}/{longitude}")]
        public string SaveGpsData(string userId, float latitude, float longitude)
        {
            if(DbContext.Users.Where(p=>p.Id == userId).FirstOrDefault()==null)
                return "unknown userId";
                
            GpsPosition GpsData = new GpsPosition()
            {
                UserId = userId,
                GpsPositionLatitude = latitude,
                GpsPositionLongitude = longitude,
                GpsPositionDate = DateTime.Now,

            };
            DbContext.Add(GpsData);
            DbContext.SaveChanges();
            return "Saved";
        }

        [HttpPost]
        [Route("/api/[controller]/SaveGpsData")]
        public string SaveGps(GpsPosition position){
            if(DbContext.Users.Where(p=>p.Id == position.UserId).FirstOrDefault()==null)
                return "unknown userId";

            DbContext.Add(position);
            DbContext.SaveChanges();
            return "Saved";

        }

        ///If called by App, we need to pass the userId as argument
        [HttpGet]
        [Route("/api/[controller]/GetGpsData/{userId}")]
        public List<GpsPosition> GetGpsData(string userId)
        {
            if (User.Identity.IsAuthenticated)
            {
                return DbContext.GpsPosition.Where(p => p.UserId == User.Claims.FirstOrDefault().Value).ToList();
            }
            else
            {
                if(userId!=null)
                {
                    return DbContext.GpsPosition.Where(p => p.UserId == userId).ToList();
                }
            }
            return null;
        }










        // GET: Localisation/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Localisation/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Localisation/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: Localisation/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Localisation/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: Localisation/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Localisation/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}