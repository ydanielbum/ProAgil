using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.API.Dtos;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;

        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
               var eventos = await _repo.GetAllEventoAsync(true);   

                var result = _mapper.Map<IEnumerable<EventoDto>>(eventos);

               return Ok(result); 

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }
        }

        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, true);

                var result = _mapper.Map<EventoDto>(evento);

               return Ok(result); 

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }
        }

        [HttpGet("getByTema/{Tema}")]
        public async Task<IActionResult> Get(string Tema)
        {
            try
            {
                var evento = await _repo.GetAllEventoAsyncByTema(Tema, true);

                var result = _mapper.Map<EventoDto>(evento);


               return Ok(result); 

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);

               _repo.Add(evento);

               if (await _repo.SaveChangesAsync())
               {
                   return Created($"/api/evento/{model.Id}", _mapper.Map<Evento>(model));
               }

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }

            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId,EventoDto model)
        {
            try
            {
               var evento = await _repo.GetEventoAsyncById(EventoId, false);
               if (evento == null)
               {
                   return NotFound();
               }

                _mapper.Map(model, evento);

               _repo.Update(evento);

               if (await _repo.SaveChangesAsync())
               {
                   return Created($"/api/evento/{model.Id}", _mapper.Map<Evento>(model));
               }

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }

            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
               var evento = await _repo.GetEventoAsyncById(EventoId, false);
               if (evento == null)
               {
                   return NotFound();
               }

               _repo.Delete(evento);

               if (await _repo.SaveChangesAsync())
               {
                    return Ok();
               }

            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }

            return BadRequest();
        }
    }
}