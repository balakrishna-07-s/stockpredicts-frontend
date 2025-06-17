
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  phone: string;
  email: string;
  isLeader?: boolean;
}

const Contact = () => {
  const teamLeader: TeamMember = {
    name: "Balakrishna",
    role: "BCA 3rd Year, 6th Semester",
    phone: "+91 74112 46810",
    email: "balu636107@gmail.com",
    isLeader: true,
  };

  const teamMembers: TeamMember[] = [
    {
      name: "Darshan S R",
      role: "Team Member",
      phone: "+91 95915 52732",
      email: "darshansr9591@gmail.com",
    },
    {
      name: "Chandan K M",
      role: "Team Member",
      phone: "+91 63600 91665",
      email: "chandankm6360@gmail.com",
    },
    {
      name: "Kiran N P",
      role: "Team Member",
      phone: "+91 63616 43876",
      email: "kirannp6361@gmail.com",
    },
    {
      name: "Kiran Kumar B",
      role: "Team Member",
      phone: "+91 95352 45718",
      email: "kirankb9535@gmail.com",
    },
    {
      name: "Kiran H S",
      role: "Team Member",
      phone: "+91 91081 18327",
      email: "kiranhs9108@gmail.com",
    },
    {
      name: "Darshan K N",
      role: "Team Member",
      phone: "+91 89718 42947",
      email: "darshankn8971@gmail.com",
    },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Team Leader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContactCard member={teamLeader} />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <ContactCard member={member} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ContactCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">
        {member.name}
        {member.isLeader && (
          <span className="ml-2 text-xs uppercase bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
            Leader
          </span>
        )}
      </h3>
      <p className="text-muted-foreground">{member.role}</p>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Phone className="h-4 w-4" />
        <a href={`tel:${member.phone}`} className="hover:text-primary">
          {member.phone}
        </a>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Mail className="h-4 w-4" />
        <a href={`mailto:${member.email}`} className="hover:text-primary">
          {member.email}
        </a>
      </div>
    </div>
  );
};

export default Contact;
