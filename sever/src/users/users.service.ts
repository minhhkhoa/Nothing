import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EventsGateway } from '../events/events.gateway';

export const mockUsers = [
  { id: 1, name: 'Nguyen Van An', age: 25, email: 'an.nguyen@example.com' },
  { id: 2, name: 'Tran Thi Bich', age: 30, email: 'bich.tran@example.com' },
  { id: 3, name: 'Le Van Cuong', age: 22, email: 'cuong.le@example.com' },
  { id: 4, name: 'Pham Thi Dao', age: 28, email: 'dao.pham@example.com' },
  { id: 5, name: 'Hoang Van Duc', age: 35, email: 'duc.hoang@example.com' },
  {
    id: 6,
    name: 'Nguyen Thi Giang',
    age: 27,
    email: 'giang.nguyen@example.com',
  },
  { id: 7, name: 'Vo Van Hai', age: 40, email: 'hai.vo@example.com' },
  { id: 8, name: 'Pham Thi Hoa', age: 21, email: 'hoa.pham@example.com' },
  { id: 9, name: 'Dang Van Khanh', age: 29, email: 'khanh.dang@example.com' },
  { id: 10, name: 'Nguyen Thi Lan', age: 33, email: 'lan.nguyen@example.com' },
  { id: 11, name: 'Bui Van Long', age: 26, email: 'long.bui@example.com' },
  { id: 12, name: 'Do Thi Mai', age: 24, email: 'mai.do@example.com' },
  { id: 13, name: 'Nguyen Van Nam', age: 31, email: 'nam.nguyen@example.com' },
];

export type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

@Injectable()
export class UsersService {
  private users = [...mockUsers];
  private nextId = mockUsers.length + 1;

  constructor(private readonly eventsGateway: EventsGateway) {}

  create(createUserDto: CreateUserDto) {
    const user: User = {
      id: this.nextId++,
      ...createUserDto,
    };
    this.users.push(user);

    //- emit socket về FE khi tạo user success
    this.eventsGateway.emitEventToAll('create-user', user);

    return {
      statusCode: 200,
      message: 'Tạo người dùng thành công',
      data: {
        user,
      },
    };
  }

  findAll() {
    return {
      statusCode: 200,
      message: 'Lấy danh sách người dùng thành công',
      data: {
        users: this.users,
      },
    };
  }

  findOne(id: number) {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return {
      statusCode: 200,
      message: 'Lấy người dùng theo id thành công',
      data: {
        user,
      },
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    this.users = this.users.map((u) =>
      u.id === id ? { ...u, ...updateUserDto } : u,
    );

    return {
      statusCode: 200,
      message: 'Cap nhat người dùng theo id thanh cong',
      // data: {
      //   user
      // }
    };
  }

  remove(id: number | Array<number>) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException(`User ${id} not found`);
    this.users.splice(index, 1);
    return { message: `User ${id} xóa thành công` };
  }

  removeMany(ArrayId: number[]) {
    if (Array.isArray(ArrayId)) {
      const notFoundIds: number[] = [];

      ArrayId.forEach((userId) => {
        const index = this.users.findIndex((u) => u.id === userId);
        if (index === -1) {
          notFoundIds.push(userId);
        } else {
          this.users.splice(index, 1);
        }
      });

      if (notFoundIds.length > 0) {
        throw new NotFoundException(
          `User(s) ${notFoundIds.join(', ')} not found`,
        );
      }

      return { message: `Xóa thành công các user: ${ArrayId.join(', ')}` };
    }
  }
}
