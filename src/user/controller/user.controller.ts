import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserRole } from '../models/user.interface';
import { UserService } from '../service/user.service';

//O parametro dentro do método indica o endpoint/rota.
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('')
  create(@Body() user: User): Observable<User | unknown> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError(err => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<unknown> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<User> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }


  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }

  @Get()
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('username') username: string,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({
      page: Number(page), 
      limit: Number(limit),
      route: 'http://localhost:3000/users',
    });
  }

}