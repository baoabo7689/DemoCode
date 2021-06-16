using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace GamesAdmin.Core.Models.Chip
{
    public class ChipModel
    {
        public string Id { get; set; }

        public ChipTheme Theme { get; set; }
        
        [Required]
        public string Label { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Value { get; set; }

        public bool Enabled { get; set; }
    }
}
