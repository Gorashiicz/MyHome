import Link from "next/link";
import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <Link href="/projekty" className="text-sm text-emerald-700 hover:underline">
        ← Zpět na stavby
      </Link>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Nová stavba</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProject} className="space-y-4">
            <div>
              <Label htmlFor="name">Název stavby *</Label>
              <Input id="name" name="name" required className="mt-1" placeholder="RD Nová Ves" />
            </div>
            <div>
              <Label htmlFor="description">Popis</Label>
              <Textarea id="description" name="description" className="mt-1" rows={2} />
            </div>
            <div>
              <Label htmlFor="addressText">Adresa / lokalita</Label>
              <Input id="addressText" name="addressText" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="constructionType">Typ stavby</Label>
              <Input
                id="constructionType"
                name="constructionType"
                className="mt-1"
                placeholder="Rodinný dům"
              />
            </div>
            <div>
              <Label htmlFor="budgetMode">Režim rozpočtu</Label>
              <Select id="budgetMode" name="budgetMode" defaultValue="limited" className="mt-1">
                <option value="limited">S celkovým limitem</option>
                <option value="open">Otevřený (bez limitu)</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="budgetLimit">Celkový limit (Kč)</Label>
              <Input
                id="budgetLimit"
                name="budgetLimit"
                type="number"
                min={0}
                className="mt-1"
                placeholder="5500000"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startDate">Začátek</Label>
                <Input id="startDate" name="startDate" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="expectedFinish">Předpokládané dokončení</Label>
                <Input
                  id="expectedFinish"
                  name="expectedFinish"
                  type="date"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Stav projektu</Label>
              <Select id="status" name="status" defaultValue="active" className="mt-1">
                <option value="planning">Plánování</option>
                <option value="active">Aktivní</option>
                <option value="paused">Pozastaveno</option>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Vytvořit stavbu
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
