import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ClientGrpc,
} from '@nestjs/microservices';
import { Observable, ReplaySubject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { HeroById } from './interfaces/heroById.interface';
import { Hero } from './interfaces/hero.interface';

interface HeroService {
  findOne(data: Observable<HeroById>): Observable<Hero>;
  findMany(upstream: Observable<HeroById>): Observable<Hero>;
}

@Controller('hero')
export class HeroController implements OnModuleInit {
  private readonly items: Hero[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];
  private heroService: HeroService;

  constructor(@Inject('HERO_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.heroService = this.client.getService<HeroService>('HeroService');
  }

  @Get()
  getMany(): Observable<Hero[]> {
    const ids$ = new ReplaySubject<HeroById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();

    const stream = this.heroService.findMany(ids$.asObservable());
    return stream.pipe(toArray());
  }

  @Get(':id')
  getById(@Param('id') id: number): Observable<Hero> {
    // return this.heroService.findOne({ id: +id });
    const idSubj = new ReplaySubject<HeroById>();
    idSubj.next({ id });
    idSubj.complete();

    const stream = this.heroService.findOne(idSubj.asObservable());
    return stream;
  }
}
