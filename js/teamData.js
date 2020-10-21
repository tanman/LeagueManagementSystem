 var teamData = {
     lookups:  {
       leagues: [
          {
           label: "League 1",
           id:1
          },
         {
           label: "League 2",
           id:2
          },
          {
           label: "League 2",
           id:3
          }
          ],
       divisions: [ 
          {
           label: "Division 1",
           id:1
          },
         {
           label: "Division 2",
           id:2
          },
          {
           label: "Division 2",
           id:3
          }
          ],
      licenseLevels: [ 
          {
           label: "A",
           id:1
          },
         {
           label: "B",
           id:2
          },
          {
           label: "C",
           id:3
          },
          {
           label: "D",
           id:4
          }
          ],
     },
     data: [
       {
         id: 1,
         name:"Raptors",
         coachId: 1,
         coachFirst: "Ken",
         coachLast: "jenson",
         coachPhone: "801-333-4444",
         coachEmail: "ken.jenson@uvu.edu",
         coachLicenseLevel: 1,
         league: 1,
         division: 2,
         playerCount: 5
       },
        {
         id: 2,
         name:"Killer Bunnies",
         coachId: 2,
         coachFirst: "Peter",
         coachLast: "Rabbit",
         coachPhone: "801-333-4444",
         coachEmail: "peter.rabbit@uvu.edu",
         coachLicenseLevel: 1,
         league: 2,
         division: 2,
         playerCount: 6
       },
       {
         id: 3,
         name:"Thunderbirds",
         coachId: 3,
         coachFirst: "Harry",
         coachLast: "DirtyDog",
         coachPhone: "801-333-4444",
         coachEmail: "harry.dirty.dog@uvu.edu",
         coachLicenseLevel: 2,
         league: 3,
         division: 2,
         playerCount: 7
       }
     ],
     viewModel: {
       sortColumn: 'name',
       sortDirection: 'asc'
     }
     
   }

export default teamData;