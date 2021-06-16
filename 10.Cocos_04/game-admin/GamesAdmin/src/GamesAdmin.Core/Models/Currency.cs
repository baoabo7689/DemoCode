namespace GamesAdmin.Core.Models
{
    public class Currency
    {
        public Currency(string id, string name)
        {
            this.Id = id;
            this.Name = name;
        }

        public string Id { get; }

        public string Name { get; }

    }
}
