 var teamData = {
     lookups:  {
       leagues: [
          {
           label: "LCS",
           id: "1"
          },
         {
           label: "LEC",
           id: "2"
          },
          {
           label: "LCK",
           id: "3"
          }
          ],
       divisions: [ 
          {
           label: "1",
           id: "1"
          },
         {
           label: "2",
           id: "2"
          },
          {
           label: "3",
           id: "3"
          }
          ],
      licenseLevels: [ 
          {
           label: "A",
           id: "1"
          },
         {
           label: "B",
           id: "2"
          },
          {
           label: "C",
           id: "3"
          },
          {
           label: "D",
           id: "4"
          }
          ],
     },
     data: [
       {
         id: "0",
         name:"Raptors",
         coachId: "1",
         coachFirst: "Ken",
         coachLast: "jenson",
         coachPhone: "(713) 412-9423",
         coachEmail: "ken.jenson@uvu.edu",
         coachLicenseLevel: "C",
         coachAddress: "8566 Wilderman Knolls",
         coachCity: "Austin",
         coachState: "TX",
         coachZip: "77491",
         coachUserName: "mrKennyj",
         league: "LCS",
         division: "2",
         playerCount: "5"
       },
        {
         id: "1",
         name:"Killer Bunnies",
         coachId: "2",
         coachFirst: "Peter",
         coachLast: "Rabbit",
         coachPhone: "(801) 333-4444",
         coachEmail: "peter.rabbit@uvu.edu",
         coachLicenseLevel: "C",
         coachAddress: "2605 Alivia Forks Dr",
         coachCity: "Dallas",
         coachState: "TX",
         coachZip: "77856",
         coachUserName: "loPetier",
         league: "LEC",
         division: "3",
         playerCount: "6"
       },
       {
         id: "2",
         name:"SK Telecom T1",
         coachId: "3",
         coachFirst: "Kim",
         coachLast: "Jeong-gyun",
         coachPhone: "(832) 974-9999",
         coachEmail: "kim.jeong-gyun@t1.com",
         coachLicenseLevel: "A",
         coachAddress: "5673 Kris Port Suite",
         coachCity: "Houston",
         coachState: "TX",
         coachZip: "77429",
         coachUserName: "sktKkoma",
         league: "LCK",
         division: "1",
         playerCount: "7"
       }
     ],
     viewModel: {
       sortColumn: 'name',
       sortDirection: 'asc'
     }
     
   }

export default teamData;